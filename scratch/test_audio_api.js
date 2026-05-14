const axios = require('axios');

async function testApi() {
  const reciterId = 7; // Mishary Alafasy
  const chapterId = 1; // Al-Fatiha
  const url = `https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterId}?segments=true`;
  
  console.log(`Testing URL: ${url}`);
  try {
    const response = await axios.get(url);
    console.log('Success!');
    console.log('Root keys:', Object.keys(response.data));
    if (response.data.audio_file) {
      console.log('Audio URL:', response.data.audio_file.audio_url);
      console.log('Segments count:', response.data.audio_file.segments?.length);
    }
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }
}

testApi();
