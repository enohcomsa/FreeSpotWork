describe('Booking rescheduling', () => {
  const isStaging = Cypress.config('baseUrl')?.includes('netlify');
  const email = isStaging ? 'student@staging.freespot' : 'student@local.e2e';


  beforeEach(() => {
    cy.task('seedDb');
    cy.login(email, 'Password123!');
    cy.visit('/my-bookings');
  });

  it('should reschedule a booking', () => {
    // Capture the booking we are going to reschedule
    cy.get('[data-automation-id="booking-card-ui"]')
      .first()
      .as('booking');

    cy.get('@booking')
      .invoke('attr', 'data-booking-id')
      .as('bookingId');

    cy.get('@booking')
      .find('[data-automation-id="booking-slot"]')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('originalSlot');
      });

    // Open rescheduling
    cy.get('@booking')
      .find('[data-automation-id="reschedule-button"]')
      .click();

    // Verify booking was preselected
    cy.get('[data-automation-id="booking-input"]')
      .invoke('val')
      .should('not.be.empty');

    // Verify search results
    cy.get('[data-automation-id="reschedule-option-card"]')
      .should('have.length.at.least', 1);

    // Capture the selected option's date and time
    cy.get('[data-automation-id="reschedule-option-card"]')
      .first()
      .find('[data-automation-id="booking-date"]')
      .invoke('text')
      .then((text) => {
        const [date, hours] = text.split('|').map((part) => part.trim());
        const [startHour, endHour] = hours.split('-');

        cy.wrap(date).as('expectedDate');
        cy.wrap(startHour).as('expectedStartHour');
        cy.wrap(endHour).as('expectedEndHour');
      });

    // Book it
    cy.get('[data-automation-id="reschedule-option-card"]')
      .first()
      .find('[data-automation-id="book-button"]')
      .click();

    // Confirm
    cy.get('[data-automation-id="confirm-dialog-yes"]')
      .click();

    // Same booking should still exist
    cy.get('@bookingId').then((bookingId) => {
      cy.get(`[data-booking-id="${bookingId}"]`)
        .should('exist');
    });

    // Booking should now display the selected slot
    cy.get('@bookingId').then((bookingId) => {
      cy.get(`[data-booking-id="${bookingId}"]`).within(() => {
        cy.get('@expectedDate').then((expectedDate) => {
          cy.get('[data-automation-id="booking-date"]')
            .invoke('text')
            .should('include', expectedDate as string);
        });

        cy.get('@expectedStartHour').then((expectedStartHour) => {
          cy.get('[data-automation-id="start-hour"]')
            .should('have.text', `${expectedStartHour}-`);
        });

        cy.get('@expectedEndHour').then((expectedEndHour) => {
          cy.get('[data-automation-id="end-hour"]')
            .should('have.text', expectedEndHour as string);
        });
      });
    });

    // Booking should differ from the original slot
    cy.get('@originalSlot').then((originalSlot) => {
      cy.get('@bookingId').then((bookingId) => {
        cy.get(`[data-booking-id="${bookingId}"]`)
          .find('[data-automation-id="booking-slot"]')
          .invoke('text')
          .then((currentSlot) => {
            expect(currentSlot).to.not.equal(originalSlot);
          });
      });
    });
  });

  it('should keep the booking unchanged when rescheduling is cancelled', () => {
    cy.get('[data-automation-id="booking-card-ui"]')
      .first()
      .as('booking');

    cy.get('@booking')
      .invoke('attr', 'data-booking-id')
      .as('bookingId');

    cy.get('@booking')
      .find('[data-automation-id="booking-date"]')
      .invoke('text')
      .then((text) => {
        cy.wrap(text).as('originalDate');
      });

    cy.get('@booking')
      .find('[data-automation-id="reschedule-button"]')
      .click();

    cy.get('[data-automation-id="reschedule-option-card"]')
      .first()
      .find('[data-automation-id="book-button"]')
      .click();

    // Cancel confirmation
    cy.get('[data-automation-id="confirm-dialog-no"]')
      .click();

    // Dialog should close
    cy.get('[role="dialog"]').should('not.exist');

    // Booking should still exist with the same date
    cy.get('@bookingId').then((bookingId) => {
      cy.get('@originalDate').then((originalDate) => {
        cy.get(`[data-booking-id="${bookingId}"]`)
          .find('[data-automation-id="booking-date"]')
          .should('have.text', originalDate);
      });
    });
  });
});
