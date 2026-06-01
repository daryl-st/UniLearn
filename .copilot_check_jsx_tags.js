const fs = require('fs');
const s = fs.readFileSync('apps/frontend/src/pages/admin/UserManagement.tsx','utf8');
const stack = [];
const tagRe = /<(\/)?([A-Za-z0-9_:-]+)([\s\S]*?)>/g;
let m;
while ((m = tagRe.exec(s)) !== null) {
  const closing = !!m[1];
  const tag = m[2];
  const rest = m[3] || '';
  const selfClosing = rest.trim().endsWith('/');
  const pos = m.index;
  const line = s.slice(0, pos).split('\n').length;
  console.log(line, closing ? 'closing' : 'opening', tag, selfClosing ? 'self' : '');
  if (tag === 'CreateUserForm') {
    console.log('MATCH:', JSON.stringify(m[0].slice(0,200)));
  }
  if (closing) {
    if (stack.length === 0 || stack[stack.length - 1].tag !== tag) {
      console.error('Mismatch at line', line, 'expected closing for', stack.length ? stack[stack.length - 1].tag : '<none>', 'but found', tag);
      process.exit(1);
    }
    stack.pop();
  } else if (!selfClosing && !['input','img','br','hr','meta','link'].includes(tag.toLowerCase())) {
    stack.push({ tag, line });
  }
}
if (stack.length > 0) {
  console.error('Unclosed tag', stack[stack.length - 1]);
  process.exit(2);
}
console.log('OK');
