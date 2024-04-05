const PasswordHash = require('node-phpass').PasswordHash;
const CRYPT_BLOWFISH = require('node-phpass').CRYPT_BLOWFISH;
const CRYPT_EXT_DES = require('node-phpass').CRYPT_EXT_DES;
// or
// const { PasswordHash, CRYPT_BLOWFISH, CRYPT_EXT_DES } = require('node-phpass')

const len = 8;
const portable = true;
// major PHP version, 5 or 7, as it is a port of PHPass PHP class we rely
// on php version on gensalt_private() method, it is an optional constructor 
// argument which defaults to 7
const phpversion = 7; 

const hasher = new PasswordHash(len, portable, phpversion);
console.log('Hashing 123456 string');
hasher.HashPassword('123456').then(hash => console.log('Private hash: ', hash));
hasher.HashPassword('123456', CRYPT_BLOWFISH).then(hash => console.log('BCrypt hash: ', hash));
hasher.HashPassword('123456', CRYPT_EXT_DES).then(hash => console.log('DES hash: ', hash));