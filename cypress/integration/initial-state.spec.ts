context('Initial State', () => {
  const width = 500;
  const height = 500;

  beforeEach(() => {
    cy.viewport(width, height);
    cy.visit('/initial-state.html');
  });

  it('should render', () => {
    cy.get('.px-layout').should(($layout) => {
      expect($layout).to.have.length(1);
    });
  });
});
