const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ymdjulwkwoppfkbtnqnu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZGp1bHdrd29wcGZrYnRucW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjU4MjMsImV4cCI6MjA2NjA0MTgyM30.mQFEf29IpgRXtlNISG5SqUvdkMtyNoedePtW0vwGQAQ';

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    const { data, error } = await supabase
      .from('campsites')
      .select('name_ja, facilities, activities')
      .or('facilities.cs.{pool},activities.cs.{pool}');
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Pool data:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Exception:', err);
  }
})();
