import { describe, it } from 'node:test';
import * as assert from 'assert';
import { converter } from '../src/converter';
import { format } from './format';

describe('Converter: Cypress', { concurrency: true }, () => {
  it('Replace cy.visit by awaited page.goto', () => {
    const result = converter('cy.visit("http://localhost")');

    assert.strictEqual(
      format(result),
      format('await page.goto("http://localhost")')
    );
  });

  it('Do not replace fn.visit by awaited page.goto', () => {
    const result = converter('fn.visit("http://localhost")');

    assert.strictEqual(format(result), format('fn.visit("http://localhost")'));
  });

  it('Replace cy.get(selector).click() by awaited page.click(selector)', () => {
    const result = converter('cy.get("selector").click()');

    assert.strictEqual(format(result), format('await page.click("selector")'));
  });

  it('Do not replace cy.fn(selector).click() by awaited page.click(selector)', () => {
    const result = converter('cy.fn("selector").click()');

    assert.strictEqual(format(result), format('cy.fn("selector").click()'));
  });

  it('Do not replace fn.click(selector).click() by awaited page.click(selector)', () => {
    const result = converter('cy.fn("selector").click()');

    assert.strictEqual(format(result), format('cy.fn("selector").click()'));
  });
});