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

    return cy.wait(100);
  });

  it('should merge', () => {
    cy.get('.px-container:nth-child(4) .px-corner:nth-child(3)')
      .first()
      .trigger('mousedown', 20, 20, { force: true });
    cy.window()
      .trigger('mousemove', { clientX: 375, clientY: 260 })
      .trigger('mousemove', { clientX: 385, clientY: 260 })
      .trigger('mousemove', { clientX: 395, clientY: 260 })
      .trigger('mousemove', { clientX: 405, clientY: 260 })
      .trigger('mousemove', { clientX: 415, clientY: 260 })
      .trigger('mouseup', { clientX: 425, clientY: 260 });

    cy.get('.px-container').should(($containers) => {
      expect($containers).to.have.lengthOf(3);
    });
  });

  describe('when one of the container is a group', () => {
    it('should not merge', () => {
      cy.get('.px-container:nth-child(2) .px-corner:nth-child(5)')
        .first()
        .trigger('mousedown', 20, 20, { force: true });
      cy.window()
        .trigger('mousemove', { clientX: 250, clientY: 250 })
        .trigger('mousemove', { clientX: 250, clientY: 260 })
        .trigger('mousemove', { clientX: 250, clientY: 270 })
        .trigger('mousemove', { clientX: 250, clientY: 280 })
        .trigger('mousemove', { clientX: 250, clientY: 290 })
        .trigger('mouseup', { clientX: 250, clientY: 260 });

      cy.get('.px-container').should(($containers) => {
        expect($containers).to.have.lengthOf(4);
      });
    });
  });

  describe('when is not the correct direction', () => {
    it('should not merge', () => {
      cy.get('.px-container:nth-child(4) .px-corner:nth-child(3)')
        .first()
        .trigger('mousedown', 20, 20, { force: true });
      cy.window()
        .trigger('mousemove', { clientX: 375, clientY: 260 })
        .trigger('mousemove', { clientX: 375, clientY: 250 })
        .trigger('mousemove', { clientX: 375, clientY: 240 })
        .trigger('mousemove', { clientX: 375, clientY: 230 })
        .trigger('mousemove', { clientX: 375, clientY: 220 })
        .trigger('mouseup', { clientX: 375, clientY: 210 });

      cy.get('.px-container').should(($containers) => {
        expect($containers).to.have.lengthOf(4);
      });
    });
  });
});
