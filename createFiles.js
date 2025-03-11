const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'Frontend/src/pages/Clubs'); // Adjust if needed

const files = [
  
  '/ThemeToggle.jsx',
  '/ClubHeader.jsx',
  '/ClubEditForm.jsx',
  '/ClubHead.jsx',
  '/ClubStats.jsx',
  '/MembersList.jsx',
  '/MemberItem.jsx',
  '/MemberEditForm.jsx',
  '/AddMemberDialog.jsx',
  '/LoadingSpinner.jsx',
  '/ErrorDisplay.jsx',
  '/utils/validators.js',
  '/utils/api.js'
];

files.forEach(file => {
  const filePath = path.join(frontendDir, file);
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`Created: ${filePath}`);
  } else {
    console.log(`Already exists: ${filePath}`);
  }
});
