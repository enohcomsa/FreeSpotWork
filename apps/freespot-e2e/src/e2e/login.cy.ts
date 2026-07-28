describe('Auth', () => {
  beforeEach(() => {
    cy.task('seedDb');
  });

  it('should login', () => {
    cy.login();
  })

  it('should not open the user setup dialog for an initialized user', () => {
    cy.login();
    cy.get('[data-automation-id="user-setup-dialog"]').should('not.exist');
  })
});
