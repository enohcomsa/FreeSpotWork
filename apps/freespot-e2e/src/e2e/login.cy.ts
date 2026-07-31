describe('Auth', () => {
  const isStaging = Cypress.config('baseUrl')?.includes('netlify');
  const email = isStaging ? 'student@staging.freespot' : 'student@local.e2e';

  beforeEach(() => {
    cy.task('seedDb');
  });

  it('should login', () => {
    cy.login(email, 'Password123!');
  })

  it('should not open the user setup dialog for an initialized user', () => {
    cy.login(email, 'Password123!');
    cy.get('[data-automation-id="user-setup-dialog"]').should('not.exist');
  })
});
