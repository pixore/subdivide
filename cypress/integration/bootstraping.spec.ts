import '../../cypress'

const width = 500;
const height = 500;

context('Boostraping', () => {
  beforeEach(() => {
    cy.viewport(width, height);
    cy.visit('/simple.html');
  });

  it('should be one container', () => {
    cy.get('.px-container').should(($container) => {
      expect($container).to.have.length(1);
    });

    cy.get('.px-container .px-corner').should(($corners) => {
      expect($corners).to.have.length(4);
    })
  });

  it('should cover all the view', () => {
    cy.get('.px-container').should(($container) => {
      expect($container.height()).to.be.equal(height);
      expect($container.width()).to.be.equal(width);

      const style = $container.attr('style');
      expect(style).to.contains('width: 100%');
      expect(style).to.contains('height: 100%');
      expect(style).to.contains('top: 0%');
      expect(style).to.contains('left: 0%');
    });
  });
});
