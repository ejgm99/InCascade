import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);

export function highlighter(code){
    console.log('Running our custom highlighter on : ',code)
    let out=  hljs.highlightAuto(code).value;
    console.log('Output: ',out)
    return out;
}