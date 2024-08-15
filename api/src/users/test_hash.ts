// const RandBytes = new require('randbytes');

// const crypto = require('crypto');

// import { cryptoJS } from 'crypto-js';

// import bcrypt from "bcrypt";

// PHP Javscript ported functions

// const { chr, ord, strpos } = require('locutus/php/strings');

// const { uniqid } = require('locutus/php/misc');

// const { rand } = require('locutus/php/math');

// const { microtime } = require('locutus/php/datetime');

///////////

import RandBytes from "randbytes";
import crypto from "crypto";
import cryptoJS from "crypto-js";
import bcrypt from "bcrypt";

import { chr, ord, strpos } from "locutus/php/strings";
import { uniqid } from "locutus/php/misc";
import { rand } from "locutus/php/math";
import { microtime } from "locutus/php/datetime";
import { Injectable } from "@nestjs/common";

export const CRYPT_BLOWFISH = 1;
export const CRYPT_EXT_DES = 2;

class PasswordHash {
  private readonly php_major_version: number;
  private readonly itoa64: string;
  private readonly iteration_count_log2: number;
  private readonly portable_hashes: boolean;
  private readonly random_state: string;

  constructor(
    iteration_count_log2: number,
    portable_hashes: boolean,
    php_major_version: number,
  ) {
    this.php_major_version = php_major_version || 7;

    this.itoa64 =
      "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (iteration_count_log2 < 4 || iteration_count_log2 > 31)
      iteration_count_log2 = 8;

    this.iteration_count_log2 = iteration_count_log2;

    this.portable_hashes = portable_hashes;

    const mtime = microtime();

    const uniq = uniqid(rand(), true);

    this.random_state = `${mtime}${uniq}`;
  }

  /**

    * Only works on Unix like because use /dev/urandom

    * 

    * @param {integer} count 

    * @return {Promise}

    */

  get_random_bytes(count: any) {
    const promise = new Promise((resolve, reject) => {
      let output = "";

      const randomSource = RandBytes.urandom.getInstance();

      randomSource.getRandomBytes(count, function (buff: any) {
        resolve(buff.toString("binary"));
      });
    });

    return promise;
  }

  encode64(input: any, count: any) {
    let output = "";

    let i = 0,
      value;

    let v;

    do {
      value = ord(input.charAt(i++));

      v = value & 0x3f;

      output = `${output}${this.itoa64.charAt(v)}`;

      if (i < count) {
        value |= ord(input.charAt(i)) << 8;
      }

      v = (value >> 6) & 0x3f;

      output = `${output}${this.itoa64.charAt(v)}`;

      if (i++ >= count) {
        break;
      }

      if (i < count) {
        value |= ord(input.charAt(i)) << 16;
      }

      v = (value >> 12) & 0x3f;

      output = `${output}${this.itoa64.charAt(v)}`;

      if (i++ >= count) {
        break;
      }

      v = (value >> 18) & 0x3f;

      output = `${output}${this.itoa64.charAt(v)}`;
    } while (i < count);

    return output;
  }

  gensalt_private(input: any) {
    let output = "$P$";

    // INFO: sum 5 for PHP >= 5 or sum 3 otherwise

    const inc = this.php_major_version >= 5 ? 5 : 3;

    const index = Math.min(this.iteration_count_log2 + inc, 30);

    const char = this.itoa64.charAt(index);

    const encoded = this.encode64(input, 6);

    output = `${output}${char}`;

    output = `${output}${encoded}`;

    return output;
  }

  crypt_private(password: any, setting: any) {
    let output = "*0";

    if (setting.substr(0, 2) == output) output = "*1";

    const id = setting.substr(0, 3);

    // We use "$P$", phpBB3 uses "$H$" for the same thing

    if (id != "$P$" && id != "$H$") return output;

    const count_log2 = strpos(this.itoa64, setting.charAt(3));

    if (count_log2 < 7 || count_log2 > 30) return output;

    let count = 1 << count_log2;

    const salt = setting.substr(4, 8);

    if (salt.length != 8) {
      return output;
    }

    let hash = crypto
      .createHash("md5")
      .update(`${salt}${password}`, "binary")
      .digest("binary");

    do {
      hash = crypto
        .createHash("md5")
        .update(`${hash}${password}`, "binary")
        .digest("binary");
    } while (--count);

    output = setting.substr(0, 12);

    output = `${output}${this.encode64(hash, 16)}`;

    return output;
  }

  gensalt_extended(input: any) {
    let count_log2 = Math.min(this.iteration_count_log2 + 8, 24);

    // This should be odd to not reveal weak DES keys, and the

    // maximum valid value is (2**24 - 1) which is odd anyway.

    let count = (1 << count_log2) - 1;

    let output = "_";

    output = `${output}${this.itoa64.charAt(count & 0x3f)}`;

    output = `${output}${this.itoa64.charAt((count >> 6) & 0x3f)}`;

    output = `${output}${this.itoa64.charAt((count >> 12) & 0x3f)}`;

    output = `${output}${this.itoa64.charAt((count >> 18) & 0x3f)}`;

    output = `${output}${this.encode64(input, 3)}`;

    return output;
  }

  gensalt_blowfish(input: any) {
    // This one needs to use a different order of characters and a

    // different encoding scheme from the one in encode64() above.

    // We care because the last character in our encoded string will

    // only represent 2 bits.  While two known implementations of

    // bcrypt will happily accept and correct a salt string which

    // has the 4 unused bits set to non-zero, we do not want to take

    // chances and we also do not want to waste an additional byte

    // of entropy.

    const itoa64 =
      "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let output = "$2a$";

    output = `${output}${chr(ord("0") + this.iteration_count_log2 / 10)}`;

    output = `${output}${chr(ord("0") + (this.iteration_count_log2 % 10))}`;

    output = output + "$";

    let i = 0;

    do {
      let c1 = ord(input.charAt(i++));

      output = `${output}${itoa64.charAt(c1 >> 2)}`;

      c1 = (c1 & 0x03) << 4;

      if (i >= 16) {
        output = `${output}${itoa64.charAt(c1)}`;

        break;
      }

      let c2 = ord(input.charAt(i++));

      c1 |= c2 >> 4;

      output = `${output}${itoa64.charAt(c1)}`;

      c1 = (c2 & 0x0f) << 2;

      c2 = ord(input.charAt(i++));

      c1 |= c2 >> 6;

      output = `${output}${itoa64.charAt(c1)}`;

      output = `${output}${itoa64.charAt(c2 & 0x3f)}`;
    } while (1);

    return output;
  }

  /**

    * @TODO port crypt() PHP function to Javascript

    * 

    * @param {string} password

    * @param {integer} algorithm Bitwise options CRYPT_BLOWFISH | CRYPT_EXT_DES | 0

    * @return {Promise} 

    */

  HashPassword(password: any, algorithm?: any) {
    algorithm = algorithm || 0;

    if (password.length > 4096) {
      return "*";
    }

    let random = "";

    if (algorithm & CRYPT_BLOWFISH && !this.portable_hashes) {
      return this._hashWithBcrypt(password);
    } else if (algorithm & CRYPT_EXT_DES && !this.portable_hashes) {
      return this._hashWithDes(random, password);
    } else {
      return this._hashWithCryptPrivate(random, password);
    }
  }

  /**

    * 

    * @param {string} random

    * @param {string} password

    * @return {Promise} 

    */

  _hashWithBcrypt(password: any) {
    return new Promise((resolve, reject) => {
      this.get_random_bytes(16)

        .then((random) => {
          bcrypt.hash(password, this.gensalt_blowfish(random), (err, hash) => {
            if (err) {
              reject(err);
            } else {
              if (hash.length == 60) {
                resolve(hash);
              } else {
                // try with DES

                this._hashWithDes(random, password)

                  .then((hash) => resolve(hash))

                  .catch((error) => reject(error));
              }
            }
          });
        })

        .catch((error) => reject(error));
    });
  }

  /**

    * 

    * @param {string} random

    * @param {string} password

    * @return {Promise} 

    */

  _hashWithDes(random: any, password: any) {
    return new Promise((resolve, reject) => {
      if (random.length < 3) {
        return this.get_random_bytes(3)

          .then((random) => {
            let hash = cryptoJS.TripleDES.encrypt(
              password,
              this.gensalt_extended(random),
            );

            if (hash.length == 20) {
              resolve(hash);
            } else {
              this._hashWithCryptPrivate(random, password)

                .then((hash) => resolve(hash))

                .catch((error) => reject(error));
            }
          })

          .catch((error) => reject(error));
      } else {
        let hash = cryptoJS.TripleDES.encrypt(
          password,
          this.gensalt_extended(random),
        );

        if (hash.length == 20) {
          resolve(hash);
        } else {
          this._hashWithCryptPrivate(random, password)

            .then((hash) => resolve(hash))

            .catch((error) => reject(error));
        }
      }
    });
  }

  /**

    * 

    * @param {string} random

    * @param {string} password

    * @return {Promise} 

    */

  _hashWithCryptPrivate(random: any, password: any) {
    // Returning '*' on error is safe here, but would _not_ be safe

    // in a crypt(3)-like function used _both_ for generating new

    // hashes and for validating passwords against existing hashes.

    return new Promise((resolve, reject) => {
      if (random.length < 6) {
        this.get_random_bytes(6)

          .then((random) => {
            let hash = this.crypt_private(
              password,

              this.gensalt_private(random),
            );

            if (hash.length == 34) {
              resolve(hash);
            } else {
              resolve("*");
            }
          })

          .catch((error) => reject(error));
      } else {
        let hash = this.crypt_private(password, this.gensalt_private(random));

        if (hash.length == 34) {
          resolve(hash);
        } else {
          // Returning '*' on error is safe here, but would _not_ be safe

          // in a crypt(3)-like function used _both_ for generating new

          // hashes and for validating passwords against existing hashes.

          resolve("*");
        }
      }
    });
  }

  CheckPassword(password: any, stored_hash: any) {
    if (password.length > 4096) {
      return false;
    }

    let hash = this.crypt_private(password, stored_hash);

    if (hash.charAt(0) == "*")
      hash = cryptoJS.TripleDES.encrypt(password, stored_hash);

    return hash === stored_hash;
  }
}

export { PasswordHash };

//export { CRYPT_BLOWFISH, CRYPT_EXT_DES, PasswordHash }

//module.exports = { PasswordHash }

//module.exports.CRYPT_BLOWFISH = CRYPT_BLOWFISH;

// module.exports.CRYPT_EXT_DES = CRYPT_EXT_DES;

// module.exports.PasswordHash = PasswordHash;
