context('Resize', () => {
  const width = 500;
  const height = 500;

  beforeEach(() => {
    cy.viewport(width, height);
    cy.visit('/initial-state.html', {
      onBeforeLoad: (contentWindow) => {
        cy.stub(contentWindow, 'requestAnimationFrame').callsFake((fn) => {
          fn();
        });
      },
    });
  });

  it('should resize', () => {
    cy.get('.px-divider div')
      .first()
      .trigger('mousedown', 0, 200, { force: true });
    cy.window()
      .trigger('mousemove', { clientX: 250, clientY: 250 })
      .trigger('mousemove', { clientX: 230, clientY: 250 })
      .trigger('mousemove', { clientX: 200, clientY: 250 })
      .trigger('mouseup');

    cy.get('.px-container')
      .first()
      .should(($container) => {
        expect($container.width()).to.be.equal(200);
      })
      .next()
      .should(($container) => {
        expect($container.width()).to.be.equal(300);
      })
      .next()
      .should(($container) => {
        expect($container.width()).to.be.equal(150);
      })
      .next()
      .should(($container) => {
        expect($container.width()).to.be.equal(150);
      });
  });
});
