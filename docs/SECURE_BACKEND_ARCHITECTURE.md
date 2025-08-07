# 🔒 完全分離型セキュアバックエンド構成

## 🏗️ **アーキテクチャ概要**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│   API Routes     │────│   Database      │
│   (Next.js)     │    │   (Server-side)  │    │   (PostgreSQL)  │
│                 │    │                  │    │                 │
│ - UI Components │    │ - Authentication │    │ - User Table    │
│ - Client State  │    │ - Authorization  │    │ - Campsite      │
│ - API Requests  │    │ - Business Logic │    │ - Relations     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
       ↑                        ↑                        ↑
       │                        │                        │
   HTTP/HTTPS              JWT + Cookies            Connection Pool
```

## 🔐 **セキュリティ特徴**

### ✅ **完全分離**
- フロントエンドからDBへの直接アクセス **完全遮断**
- すべてのDB操作はサーバーサイドAPI経由
- Prisma Clientはサーバーサイドでのみ利用可能

### ✅ **認証・認可**
- JWT + HttpOnly Cookies
- 管理者権限の厳格なチェック
- 許可されたメールアドレスでのみ登録可能

### ✅ **データバリデーション**
- サーバーサイドでの完全なバリデーション
- SQLインジェクション攻撃を防止
- XSS攻撃対策

## 📁 **ファイル構成**

```
src/
├── lib/
│   ├── prisma.ts          # データベースクライアント（サーバーサイドのみ）
│   └── auth.ts            # 認証ユーティリティ（サーバーサイドのみ）
├── app/api/
│   ├── auth/
│   │   ├── login/route.ts     # ログインAPI
│   │   └── register/route.ts  # 登録API
│   └── secure/
│       └── campsites/route.ts # セキュアなキャンプサイトAPI
├── middleware.ts          # セキュリティミドルウェア
└── prisma/
    └── schema.prisma      # データベーススキーマ
```

## 🔧 **セットアップ手順**

### 1. **環境変数設定**
```bash
# .env.local を作成
DATABASE_URL=postgresql://username:password@localhost:5432/campsite_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_ALLOWED_EMAILS=admin@example.com
```

### 2. **データベース初期化**
```bash
# Prisma migration
npx prisma migrate dev --name init

# データベース生成
npx prisma generate

# データベース接続テスト（オプション）
npx prisma studio
```

### 3. **開発サーバー起動**
```bash
npm run dev
```

## 🛡️ **セキュリティ対策**

### 1. **認証フロー**
1. ユーザーがログイン情報を送信
2. サーバーでパスワードハッシュを検証
3. JWTトークンを生成してHttpOnly Cookieに保存
4. 以降のリクエストでトークン検証

### 2. **認可制御**
- 管理者エリア: 管理者権限必須
- セキュアAPI: エンドポイントごとに権限チェック
- ミドルウェアでのルートレベル保護

### 3. **データ保護**
- すべてのパスワードはbcryptでハッシュ化
- SQLインジェクション対策（Prisma ORM）
- XSS対策（HttpOnly Cookies + CSP）

## 📊 **API エンドポイント**

### 認証API
- `POST /api/auth/login` - ログイン
- `POST /api/auth/register` - 管理者登録

### セキュアAPI
- `GET /api/campsites` - キャンプサイト一覧（認証不要）
- `POST /api/campsites` - キャンプサイト作成（管理者権限必要）
- `PUT /api/campsites/[id]` - キャンプサイト更新（管理者権限必要）
- `DELETE /api/campsites/[id]` - キャンプサイト削除（管理者権限必要）

## 🔄 **マイグレーション手順**

### Supabaseからの移行
1. 既存データのエクスポート
2. PostgreSQLデータベースの準備
3. 環境変数の更新
4. Prismaマイグレーションの実行
5. データのインポート

### データ移行スクリプト（例）
```bash
# Supabaseからデータエクスポート
pg_dump -h your-supabase-host -U postgres -d postgres > backup.sql

# 新しいデータベースにインポート
psql -h localhost -U username -d campsite_db < backup.sql
```

## 🚀 **本番環境デプロイ**

### 環境変数
```bash
DATABASE_URL=postgresql://prod-user:prod-pass@prod-host:5432/prod-db
JWT_SECRET=extremely-long-and-random-production-secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### セキュリティチェックリスト
- [ ] JWT_SECRET が十分に長くランダム
- [ ] DATABASE_URL が本番用
- [ ] HTTPS が有効
- [ ] ADMIN_ALLOWED_EMAILS が適切に設定
- [ ] Rate limiting の実装（オプション）

---

この構成により、フロントエンドとバックエンドが完全に分離され、セキュリティが大幅に向上しました。フロントエンドからDBへの直接アクセスは完全に不可能になり、すべてのデータ操作はサーバーサイドで制御されます。
