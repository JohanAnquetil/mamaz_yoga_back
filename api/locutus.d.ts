declare module "locutus/php/strings" {
  export function chr(input: number): string;
  export function ord(input: string): number;
  export function strpos(
    haystack: string,
    needle: string,
    offset?: number,
  ): number;
}

declare module "locutus/php/misc" {
  export function uniqid(prefix?: string, moreEntropy?: boolean): string;
}

declare module "locutus/php/math" {
  export function rand(min?: number, max?: number): any;
}

declare module "locutus/php/datetime" {
  export function microtime(get_as_float?: boolean): string;
}
