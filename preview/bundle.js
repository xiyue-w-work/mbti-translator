const fs=require('node:fs');
const path=require('node:path');
const root = path.resolve(__dirname, '../miniprogram');
const modules = ['config.js','utils/catalog.js','utils/personality.js','utils/demo.js','utils/api.js','pages/index/index.js','pages/result/result.js'];
const pages = ['index','result'];
const bundle = () => JSON.stringify({
 modules: Object.fromEntries(modules.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')])),
 templates: Object.fromEntries(pages.map(name => [name, fs.readFileSync(path.join(root, `pages/${name}/${name}.wxml`), 'utf8')])),
 styles: Object.fromEntries(pages.map(name => [name, fs.readFileSync(path.join(root, `pages/${name}/${name}.wxss`), 'utf8')])),
 common: fs.readFileSync(path.join(root,'app.wxss'), 'utf8')
});

module.exports={bundle};
