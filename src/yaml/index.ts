function stringify(obj: any) {
  return `${_stringify(obj)}\n`;
}

function _stringify(obj: any, indent: boolean = false) {
  let result: string;
  if (typeof obj !== 'object') {
    result = JSON.stringify(obj);
    return result;
  }

  if (Array.isArray(obj)) {
    result = array(obj);
  } else {
    result = object(obj);
  }

  if (indent) {
    return result
      .split('\n')
      .map(l => `\x20\x20${l}`)
      .join('\n');
  }
  return result;
}

function array(arr: any[]) {
  let yaml = '';
  for (const value of arr) {
    if (typeof value !== 'object') {
      yaml += `-\x20${_stringify(value, true)}\n`;
    } else {
      yaml += `-\x20\n${_stringify(value, true)}\n`;
    }
  }

  return yaml.trim();
}

function object(obj: any) {
  const keys = Object.keys(obj);
  let yaml = '';
  for (const key of keys) {
    const escapedKey = /[^0-9a-zA-Z_-]/.test(key) ? JSON.stringify(key) : key;
    const value = obj[key];
    if (typeof value !== 'object') {
      yaml += `${escapedKey}: ${_stringify(value, true)}\n`;
    } else {
      yaml += `${escapedKey}:\n${_stringify(value, true)}\n`;
    }
  }
  return yaml.trim();
}

export { stringify };
