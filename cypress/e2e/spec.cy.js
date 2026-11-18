describe('BoxChartBuilder', () => {
  
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the homepage', () => {
        cy.contains("h1", "Box Chart Builder").should('be.visible');
    });

    it('should display the correct HTML for the selected grid item', () => {
        cy.get(".grid-item[row='1'][col='1']").should('be.visible').click();
        cy.get("#generated-html").should('be.visible')
            .should('contain.text', '<div class="box-container-rounded" style="background-color: #3B5372; color: #FFF; border-radius: 12px;">');
    });

    it('should display the correct CSS for the selected grid item', () => {
        cy.get(".grid-item[row='1'][col='1']").should('be.visible').click();
        cy.contains('button', 'Custom CSS').should('be.visible').click();
        cy.get("#generated-css").should('be.visible')
            .should('contain.text', '.box-container-rounded {');
    });
});