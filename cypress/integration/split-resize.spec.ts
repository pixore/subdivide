context('Split', () => {
  const width = 500;
  const height = 500;

  beforeEach(() => {
    cy.viewport(width, height);
    cy.visit('/simple.html', {
      onBeforeLoad: (contentWindow) => {
        cy.stub(contentWindow, 'requestAnimationFrame').callsFake((fn) => {
          fn();
        });
      },
    });
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

        cy.get('.px-divider').should(($divider) => {
          const position = $divider.offset();
          if (position) {
            expect(position.left).to.be.equal(250);
          } else {
            expect.fail('position should be defined, check $divider');
          }
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

        cy.get('.px-divider').should(($divider) => {
          const position = $divider.offset();
          if (position) {
            expect(position.top).to.be.equal(250);
          } else {
            expect.fail('position should be defined, check $divider');
          }
        });
      });
    });
  });

  describe('when top right corner is drag', () => {
    describe.only('left', () => {
      it('should split the container', () => {
        cy.get('.px-corner')
          .eq(1)
          .trigger('mousedown', 5, 35, { force: true });
        cy.window()
          .trigger('mousemove', { clientX: 457, clientY: 30 })
          .trigger('mousemove', { clientX: 456, clientY: 30 })
          .trigger('mousemove', { clientX: 455, clientY: 30 })
          .trigger('mousemove', { clientX: 440, clientY: 30 })
          .trigger('mousemove', { clientX: 435, clientY: 30 })
          .trigger('mousemove', { clientX: 432, clientY: 30 })
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

        cy.get('.px-divider').should(($divider) => {
          const position = $divider.offset();
          if (position) {
            expect(position.left).to.be.equal(250);
          } else {
            expect.fail('position should be defined, check $divider');
          }
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
          .trigger('mousemove', { clientX: 30, clientY: 457 })
          .trigger('mousemove', { clientX: 30, clientY: 456 })
          .trigger('mousemove', { clientX: 30, clientY: 455 })
          .trigger('mousemove', { clientX: 30, clientY: 440 })
          .trigger('mousemove', { clientX: 30, clientY: 435 })
          .trigger('mousemove', { clientX: 30, clientY: 432 })
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

        cy.get('.px-divider').should(($divider) => {
          const position = $divider.offset();
          if (position) {
            expect(position.top).to.be.equal(250);
          } else {
            expect.fail('position should be defined, check $divider');
          }
        });
      });
    });
  });
});
