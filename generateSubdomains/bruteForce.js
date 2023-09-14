const dns = require('dns');
/*
 * A simple function for brute forcing a list of subdomains
 * given a maximum length of each subdomain.
 */
const generateSubdomains = function (length) {
  /*
   * A list of characters from which to generate subdomains.
   *
   * This can be altered to include less common characters
   * like '-'.
   *
   * Chinese, Arabic, and Latin characters are also
   * supported by some browsers.
   */
  const charset = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let subdomains = charset;
  let subdomain;
  let letter;
  let temp;
  /*
   * Time Complexity: o(n*m)
   * n = length of string
   * m = number of valid characters
   */
  for (let i = 1; i < length; i++) {
    temp = [];
    for (let k = 0; k < subdomains.length; k++) {
      subdomain = subdomains[k];
      for (let m = 0; m < charset.length; m++) {
        letter = charset[m];
        temp.push(subdomain + letter);
        console.log('added to subdomain array: ', subdomain + letter);
      }
    }
    subdomains = temp;
  }
  return subdomains;
};
const subdomains = generateSubdomains(4);
const promises = [];
/*
 * Iterate through each subdomain, and perform an asynchronous
 * DNS query against each subdomain.
 *
 * This is much more performant than the more common `dns.lookup()`
 * because `dns.lookup()` appears asynchronous from the JavaScript,
 * but relies on the operating system's getaddrinfo(3) which is
 * implemented synchronously.
 */
subdomains.forEach((subdomain) => {
  promises.push(
    new Promise((resolve, reject) => {
      dns.resolve(`${subdomain}.mega-bank.com`, function (err, ip) {
        if (err) reject(err);
        return resolve({ subdomain: subdomain, ip: ip });
      });
    })
  );
  console.log('added to promises: ', subdomain);
});
// after all of the DNS queries have completed, log the results
Promise.all(promises)
  .then(function (results) {
    results.forEach((result) => {
      if (!!result.ip) {
        console.log(result);
      }
    });
  })
  .catch(console.log);
