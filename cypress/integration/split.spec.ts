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
          .trigger('mousemove', { clientX: 55, clientY: 30 })
          .trigger('mousemove', { clientX: 56, clientY: 30 })
          .trigger('mousemove', { clientX: 57, clientY: 30 })
          .trigger('mousemove', { clientX: 250, clientY: 30 })
          .trigger('mouseup');

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

    describe('down', () => {
      it('should split the container', () => {
        cy.get('.px-corner')
          .first()
          .trigger('mousedown', 35, 35);
        cy.window()
          .trigger('mousemove', { clientX: 30, clientY: 32 })
          .trigger('mousemove', { clientX: 30, clientY: 35 })
          .trigger('mousemove', { clientX: 30, clientY: 40 })
          .trigger('mousemove', { clientX: 30, clientY: 55 })
          .trigger('mousemove', { clientX: 30, clientY: 56 })
          .trigger('mousemove', { clientX: 30, clientY: 57 })
          .trigger('mousemove', { clientX: 30, clientY: 250 })
          .trigger('mouseup');

        cy.get('.px-container')
          .should(($containers) => {
            expect($containers).to.have.length(2);
          })
          .first()
          .should(($container) => {
            expect($container.height()).to.be.equal(250);
          })
          .next()
          .should(($container) => {
            expect($container.height()).to.be.equal(250);
          });
      });
    });
  });

  describe('when top right corner is drag', () => {
    describe('left', () => {
      it('should split the container', () => {
        cy.get('.px-corner')
          .eq(1)
          .trigger('mousedown', 5, 35, { force: true });
        cy.window()
          .trigger('mousemove', { clientX: 557, clientY: 30 })
          .trigger('mousemove', { clientX: 556, clientY: 30 })
          .trigger('mousemove', { clientX: 555, clientY: 30 })
          .trigger('mousemove', { clientX: 540, clientY: 30 })
          .trigger('mousemove', { clientX: 535, clientY: 30 })
          .trigger('mousemove', { clientX: 532, clientY: 30 })
          .trigger('mousemove', { clientX: 250, clientY: 30 })
          .trigger('mouseup');

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

  describe('when bottom right corner is drag', () => {
    describe('up', () => {
      it('should split the container', () => {
        cy.get('.px-corner')
          .eq(1)
          .trigger('mousedown', 5, 35, { force: true });
        cy.window()
          .trigger('mousemove', { clientX: 30, clientY: 557 })
          .trigger('mousemove', { clientX: 30, clientY: 556 })
          .trigger('mousemove', { clientX: 30, clientY: 555 })
          .trigger('mousemove', { clientX: 30, clientY: 540 })
          .trigger('mousemove', { clientX: 30, clientY: 535 })
          .trigger('mousemove', { clientX: 30, clientY: 532 })
          .trigger('mousemove', { clientX: 30, clientY: 250 })
          .trigger('mouseup');

        cy.get('.px-container')
          .should(($containers) => {
            expect($containers).to.have.length(2);
          })
          .first()
          .should(($container) => {
            expect($container.height()).to.be.equal(250);
          })
          .next()
          .should(($container) => {
            expect($container.height()).to.be.equal(250);
          });
      });
    });
  });
});
