import dotenv from 'dotenv';
dotenv.config();
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log('Available Models:');
      console.log(data.models.map(m => m.name).join('\n'));
    } else {
      console.log('Error fetching models:', data);
    }
  })
  .catch(console.error);
