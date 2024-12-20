import { converter } from '../src/converter.js';
import { format } from './test-utils.js';
import assert from 'assert';
import { nulCustomCommandTracker } from './nul-custom-command-tracker.js';

describe('Converter: Cypress Custom commands', () => {
  it('Migrate custom command into a normal function injecting page', () => {
    const result = converter("Cypress.Commands.add('login', () => {})", nulCustomCommandTracker);

    assert.strictEqual(format(result), format('export async function login(page: Page) {}'));
  });

  it('Migrate custom command with parameters into a normal function with parameters injecting page', () => {
    const result = converter("Cypress.Commands.add('login', (username, password) => {})", nulCustomCommandTracker);

    assert.strictEqual(format(result), format('export async function login(page: Page, username, password) {}'));
  });

  it('Migrate custom command migrating body too', () => {
    const result = converter(
      `
      Cypress.Commands.add('addTodo', (newItem: string) => {
        cy.get('[data-test=new-todo]').type(\`\${newItem}{enter}\`);
      });
    `,
      nulCustomCommandTracker
    );

    assert.strictEqual(
      format(result),
      format(`
      export async function addTodo(page: Page, newItem: string) {
        await page.locator('[data-test=new-todo]').type(\`\${newItem}{enter}\`);
      }
    `)
    );
  });
});
