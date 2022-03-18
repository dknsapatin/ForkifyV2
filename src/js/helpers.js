// FILE PURPOSE: Functions are used over and over in the project
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    // Fetch for the API
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //Place the hash id to fetch the specifc object recipe
    const data = await res.json(); // Convert constant "res" to JSON | Save it to constant "data"

    // Throw new error message base off of what the console says in each object
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
