context('Split', () => {
  const width = 500;
  const height = 500;

  beforeEach(() => {
    cy.viewport(width, height);
    cy.visit('/simple.html');
  });

  describe('when top left corner is drag', () => {
    describe('left', () => {
      it('should split the container', () => {
        cy.get('.px-corner')
          .first()
          .trigger('mousedown', 35, 35);
        cy.window()
          .trigger('mousemove', { clientX: 32, clientY: 30 })
          .trigger('mousemove', { clientX: 35, clientY: 30 })
          .trigger('mousemove', { clientX: 40, clientY: 30 })
          .trigger('mousemove', { clientX: 45, clientY: 30 })
          .trigger('mousemove', { clientX: 50, clientY: 30 })
          .trigger('mousemove', { clientX: 55, clientY: 30 })
          .trigger('mousemove', { clientX: 56, clientY: 30 })
          .trigger('mousemove', { clientX: 57, clientY: 30 })
          .trigger('mousemove', { clientX: 250, clientY: 30 })
          .trigger('mouseup', { clientX: 60, clientY: 30 });

        cy.get('.px-container')
          .should(($containers) => {
            expect($containers).to.have.length(2);
          })
          .first()
          .should(($container) => {
            expect($container.width()).to.be.equal(250);
          })
          .next()
          .should(($container) => {
            expect($container.width()).to.be.equal(250);
          });
      });
    });
  });
});
