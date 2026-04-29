import dotenv from 'dotenv';
dotenv.config();

const body = {
  business_type: 'Software Development',
  industry: 'IT',
  main_activities: 'Writing code',
  tools: 'VS Code, Git',
  team_size: '10',
  challenges: 'Scaling infrastructure',
  goals: 'Automate deployments'
};

console.log("Calling API...");
fetch('http://localhost:5000/api/generate-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})
.then(res => res.json())
.then(data => console.log('Response from server:', JSON.stringify(data, null, 2)))
.catch(err => console.error('Error:', err));
