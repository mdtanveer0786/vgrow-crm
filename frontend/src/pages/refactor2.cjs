const fs = require('fs');
const path = require('path');

const files = [
  'AccountsPage.tsx',
  'ActivitiesPage.tsx',
  'AnalyticsPage.tsx',
  'ReportsPage.tsx'
];

files.forEach(file => {
  const filePath = path.join('d:/VGROW/frontend/src/pages', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add imports
  if (!content.includes('import { Card')) {
    content = content.replace(
      /(import React.*?;\n)/,
      "$1import { Card, Button, Badge, Input, Table, TableHead, TableRow, TableCell, Modal } from '../components/ui';\n"
    );
  }

  // 2. Replace button with Button
  content = content.replace(/<button([^>]*?)className="btn-primary"([^>]*?)>/g, '<Button variant="primary"$1$2>');
  content = content.replace(/<\/button>/g, (match, offset, string) => {
    // If there is <Button previously in this line or nearby, we should replace it with </Button>
    // Just regex: replace </button> with </Button> if there's a Button in the line.
    // Actually, simpler to just replace all </button> to </Button> where it matches <Button
    return match;
  });
  
  // Custom simple replacements for button close tags:
  let parts = content.split(/(<Button|<button|<\/button>|<\/Button>)/g);
  let depth = 0;
  let out = [];
  let btnStack = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith('<Button')) {
      btnStack.push('Button');
      out.push(parts[i]);
    } else if (parts[i].startsWith('<button')) {
      btnStack.push('button');
      out.push(parts[i]);
    } else if (parts[i] === '</button>' || parts[i] === '</Button>') {
      const top = btnStack.pop();
      out.push(`</${top}>`);
    } else {
      out.push(parts[i]);
    }
  }
  content = out.join('');

  // 3. Replace <div className="glass-panel"...> with <Card...>
  parts = content.split(/(<div[^>]*className="glass-panel"[^>]*>|<form[^>]*className="glass-panel"[^>]*>|<div[^>]*>|<\/div>|<\/form>)/g);
  
  let stack = [];
  let htmlOut = [];
  
  for (let i = 0; i < parts.length; i++) {
    let p = parts[i];
    
    if (p.startsWith('<div ') && p.includes('className="glass-panel"')) {
      stack.push('Card');
      htmlOut.push(p.replace('<div', '<Card').replace('className="glass-panel"', ''));
    } else if (p.startsWith('<form ') && p.includes('className="glass-panel"')) {
      stack.push('form-card');
      // replace form with Card, we'll wrap it later if needed, or just change to Card if it supports as="form"
      // Actually, standard is to wrap it.
      let styles = p.match(/style={{(.*?)}}/);
      let formP = p.replace('className="glass-panel"', '');
      htmlOut.push('<Card>\n' + formP);
    } else if (p.startsWith('<div') || p === '<div>') {
      stack.push('div');
      htmlOut.push(p);
    } else if (p.startsWith('<form')) {
      stack.push('form');
      htmlOut.push(p);
    } else if (p === '</div>') {
      const top = stack.pop();
      if (top === 'Card') {
        htmlOut.push('</Card>');
      } else {
        htmlOut.push('</div>');
      }
    } else if (p === '</form>') {
      const top = stack.pop();
      if (top === 'form-card') {
        htmlOut.push('</form>\n</Card>');
      } else {
        htmlOut.push('</form>');
      }
    } else {
      htmlOut.push(p);
    }
  }
  content = htmlOut.join('');

  // 4. Tables
  content = content.replace(/<table[^>]*>/g, '<Table>');
  content = content.replace(/<\/table>/g, '</Table>');
  
  content = content.replace(/<thead[^>]*>/g, '<TableHead>');
  content = content.replace(/<\/thead>/g, '</TableHead>');
  
  content = content.replace(/<tr[^>]*>/g, (m) => m.replace('<tr', '<TableRow'));
  content = content.replace(/<\/tr>/g, '</TableRow>');
  
  content = content.replace(/<td([^>]*)>/g, '<TableCell$1>');
  content = content.replace(/<\/td>/g, '</TableCell>');

  content = content.replace(/<th([^>]*)>/g, '<TableCell component="th"$1>');
  content = content.replace(/<\/th>/g, '</TableCell>');
  
  content = content.replace(/<tbody[^>]*>/g, '');
  content = content.replace(/<\/tbody>/g, '');

  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Done refactoring");
