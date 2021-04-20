import axios from "axios";

/*
 Raw Data
  let d1 = fs.createReadStream('./yinyang.png')

  const base64 = 'data:image/png;base64,...'
  let d2 = await fetch(base64).then(res => res.blob());

  let d3 = new Blob(['blablabla'], {type: 'text/plain'});
*/
async function postData(url = '', data = {}) {
  axios.post(url, data, );
}

async function postJsonData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function buildFormData(formData, data, parentKey) {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File) && !(data instanceof Array)) {
    Object.keys(data).forEach(key => {
      buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else if (data instanceof Array) {
    formData.append(parentKey, JSON.stringify(data));
  } else {
    const value = data == null ? '' : data;

    formData.append(parentKey, value);
  }
}

function convToFormData(data) {
  const formData = new FormData();
  buildFormData(formData, data);
  return formData;
}

async function postFormData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    body: convToFormData(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


function genSampleTxtFile(txt = 'sample text', filename = 'sample.txt') {
  var parts = [
    new Blob([txt], {type: 'text/plain'}),
    ' Same way as you do with blob',
    new Uint16Array([33])
  ];

  return new File(parts, filename, {
      lastModified: new Date(0), // optional - default = now
      type: "overide/mimetype" // optional - default = ''
  });
}

function test2() {
  let file = genSampleTxtFile('Hello world!', 'sample.txt');
  let data = {
    emp: 145,
    file,
    typ: 0,
  };
  return postFormData('http://127.0.0.1:8000/vers/api/emp_files/', data);
}

test2().then(console.log);