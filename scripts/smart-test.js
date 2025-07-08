#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Smart test runner that detects changes and runs related tests
 */
class SmartTestRunner {
  constructor() {
    this.colors = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      reset: '\x1b[0m'
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  /**
   * Get changed files based on git status
   */
  getChangedFiles(mode = 'uncommitted') {
    try {
      let command;
      switch (mode) {
        case 'staged':
          command = 'git diff --cached --name-only --diff-filter=ACM';
          break;
        case 'uncommitted':
          command = 'git diff --name-only --diff-filter=ACM';
          break;
        case 'all-changes':
          command = 'git diff HEAD --name-only --diff-filter=ACM';
          break;
        default:
          throw new Error(`Unknown mode: ${mode}`);
      }

      const output = execSync(command, { encoding: 'utf8' });
      return output
        .split('\n')
        .filter(file => file.trim())
        .filter(file => /\.(ts|tsx|js|jsx)$/.test(file))
        .filter(file => fs.existsSync(file)); // Only existing files
    } catch (error) {
      this.log('Error getting changed files:', 'red');
      console.error(error.message);
      return [];
    }
  }

  /**
   * Find test files for given source files
   */
  findTestFiles(sourceFiles) {
    const testFiles = [];
    
    sourceFiles.forEach(file => {
      // Direct test file
      const testFile = this.getTestFilePath(file);
      if (fs.existsSync(testFile)) {
        testFiles.push(testFile);
      }

      // Component test files
      if (file.includes('/components/')) {
        const componentTestFile = file.replace('/components/', '/components/__tests__/').replace(/\.(ts|tsx)$/, '.test.$1');
        if (fs.existsSync(componentTestFile)) {
          testFiles.push(componentTestFile);
        }
      }

      // API route test files
      if (file.includes('/api/')) {
        const apiTestFile = file.replace(/\.(ts|tsx)$/, '.test.$1');
        const apiTestDir = path.dirname(file) + '/__tests__/' + path.basename(file).replace(/\.(ts|tsx)$/, '.test.$1');
        if (fs.existsSync(apiTestFile)) {
          testFiles.push(apiTestFile);
        }
        if (fs.existsSync(apiTestDir)) {
          testFiles.push(apiTestDir);
        }
      }
    });

    return [...new Set(testFiles)]; // Remove duplicates
  }

  /**
   * Get test file path for a source file
   */
  getTestFilePath(sourceFile) {
    const dir = path.dirname(sourceFile);
    const basename = path.basename(sourceFile, path.extname(sourceFile));
    const ext = path.extname(sourceFile);
    
    // Check for test file in __tests__ directory
    const testDir = path.join(dir, '__tests__');
    const testFile = path.join(testDir, `${basename}.test${ext}`);
    
    if (fs.existsSync(testFile)) {
      return testFile;
    }

    // Check for test file in same directory
    const sameDir = path.join(dir, `${basename}.test${ext}`);
    if (fs.existsSync(sameDir)) {
      return sameDir;
    }

    return testFile; // Return expected path even if doesn't exist
  }

  /**
   * Run Jest with specific files
   */
  runTests(files, options = {}) {
    if (files.length === 0) {
      this.log('⚠️  No test files found', 'yellow');
      return;
    }

    this.log('🧪 Running tests for:', 'blue');
    files.forEach(file => this.log(`  ${file}`, 'blue'));
    console.log();

    const jestArgs = [
      '--coverage',
      '--verbose',
      ...files.map(f => `--testPathPattern=${f}`),
      ...(options.watch ? ['--watch'] : []),
      ...(options.updateSnapshot ? ['--updateSnapshot'] : [])
    ];

    try {
      execSync(`npx jest ${jestArgs.join(' ')}`, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      this.showCoverageSummary();
    } catch (error) {
      this.log('❌ Tests failed', 'red');
      process.exit(1);
    }
  }

  /**
   * Run tests for related files using Jest's findRelatedTests
   */
  runRelatedTests(sourceFiles, options = {}) {
    if (sourceFiles.length === 0) {
      this.log('⚠️  No source files found', 'yellow');
      return;
    }

    this.log('🔍 Finding related tests for:', 'blue');
    sourceFiles.forEach(file => this.log(`  ${file}`, 'blue'));
    console.log();

    const jestArgs = [
      '--findRelatedTests',
      '--coverage',
      '--verbose',
      ...sourceFiles,
      ...(options.watch ? ['--watch'] : []),
      ...(options.collectCoverageFrom ? this.generateCoveragePattern(sourceFiles) : [])
    ];

    try {
      execSync(`npx jest ${jestArgs.join(' ')}`, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      this.showCoverageSummary();
    } catch (error) {
      this.log('❌ Tests failed', 'red');
      process.exit(1);
    }
  }

  /**
   * Generate coverage pattern for only related files
   */
  generateCoveragePattern(sourceFiles) {
    const patterns = sourceFiles
      .filter(file => !file.includes('.test.') && !file.includes('__tests__'))
      .map(file => `--collectCoverageFrom=${file}`);
    
    if (patterns.length > 0) {
      this.log('📊 Coverage limited to changed files only', 'yellow');
    }
    
    return patterns;
  }

  /**
   * Run focused tests with coverage only for changed files
   */
  runFocusedTests(sourceFiles, options = {}) {
    if (sourceFiles.length === 0) {
      this.log('⚠️  No source files found', 'yellow');
      return;
    }

    // Separate source files from test files
    const actualSourceFiles = sourceFiles.filter(file => 
      !file.includes('.test.') && 
      !file.includes('__tests__') &&
      !file.endsWith('.d.ts')
    );
    
    if (actualSourceFiles.length === 0) {
      this.log('⚠️  No source files to track coverage for', 'yellow');
      return this.runRelatedTests(sourceFiles, options);
    }

    this.log('🎯 Running focused tests with targeted coverage:', 'blue');
    sourceFiles.forEach(file => this.log(`  ${file}`, 'blue'));
    this.log('📊 Coverage tracking:', 'yellow');
    actualSourceFiles.forEach(file => this.log(`  ${file}`, 'yellow'));
    console.log();

    const jestArgs = [
      '--findRelatedTests',
      '--coverage',
      '--verbose',
      ...sourceFiles,
      ...actualSourceFiles.map(file => `--collectCoverageFrom=${file}`),
      '--collectCoverageFrom=!**/*.d.ts',
      '--collectCoverageFrom=!**/*.test.{ts,tsx,js,jsx}',
      '--collectCoverageFrom=!**/__tests__/**',
      ...(options.watch ? ['--watch'] : [])
    ];

    try {
      execSync(`npx jest ${jestArgs.join(' ')}`, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      this.showCoverageSummary();
    } catch (error) {
      this.log('❌ Tests failed', 'red');
      process.exit(1);
    }
  }

  /**
   * Show coverage summary
   */
  showCoverageSummary() {
    const summaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    
    if (fs.existsSync(summaryPath)) {
      try {
        const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        const total = summary.total;
        
        this.log('\n📊 Coverage Summary:', 'green');
        this.log(`  Statements: ${total.statements.pct}%`, 'green');
        this.log(`  Branches: ${total.branches.pct}%`, 'green');
        this.log(`  Functions: ${total.functions.pct}%`, 'green');
        this.log(`  Lines: ${total.lines.pct}%`, 'green');
      } catch (error) {
        this.log('Could not read coverage summary', 'yellow');
      }
    }
  }

  /**
   * Main run method
   */
  run() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'uncommitted';
    const options = {
      watch: args.includes('--watch'),
      updateSnapshot: args.includes('--updateSnapshot'),
      collectCoverageFrom: args.includes('--collectCoverageFrom'),
      focused: args.includes('--focused')
    };

    this.log('🚀 Smart Test Runner', 'blue');
    this.log(`Mode: ${mode}`, 'blue');
    if (options.focused) {
      this.log('📊 Focused coverage mode enabled', 'yellow');
    }
    console.log();

    const changedFiles = this.getChangedFiles(mode);
    
    if (changedFiles.length === 0) {
      this.log('No changed files found', 'yellow');
      return;
    }

    this.log('Changed files:', 'green');
    changedFiles.forEach(file => this.log(`  ${file}`, 'green'));
    console.log();

    // Use focused tests if requested, otherwise use regular related tests
    if (options.focused) {
      this.runFocusedTests(changedFiles, options);
    } else {
      this.runRelatedTests(changedFiles, options);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const runner = new SmartTestRunner();
  runner.run();
}

module.exports = SmartTestRunner;
