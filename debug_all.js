const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ymdjulwkwoppfkbtnqnu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZGp1bHdrd29wcGZrYnRucW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjU4MjMsImV4cCI6MjA2NjA0MTgyM30.mQFEf29IpgRXtlNISG5SqUvdkMtyNoedePtW0vwGQAQ';

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    const { data, error } = await supabase
      .from('campsites')
      .select('name_ja, facilities, activities');
    
    if (error) {
      console.error('Error:', error);
    } else {
      // poolを含むデータを検索
      const poolData = data.filter(camp => 
        camp.facilities.includes('pool') || camp.activities.includes('pool')
      );
      
      console.log('Pool camps:', JSON.stringify(poolData, null, 2));
      
      // 全ての設備・アクティビティを収集
      const allFacilities = new Set();
      const allActivities = new Set();
      
      data.forEach(camp => {
        camp.facilities.forEach(f => allFacilities.add(f));
        camp.activities.forEach(a => allActivities.add(a));
      });
      
      console.log('All facilities:', Array.from(allFacilities).sort());
      console.log('All activities:', Array.from(allActivities).sort());
    }
  } catch (err) {
    console.error('Exception:', err);
  }
})();
