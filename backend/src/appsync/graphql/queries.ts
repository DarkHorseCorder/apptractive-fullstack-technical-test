/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      identityId
      email
      firstName
      lastName
      phone
      createdAt
      updatedAt
      owner
    }
  }
`;
export const xeroListContacts = /* GraphQL */ `
  query XeroListContacts($page: Int) {
    xeroListContacts(page: $page) {
      contactID
      contactNumber
      accountNumber
      contactStatus
      name
      firstName
      lastName
      companyNumber
      emailAddress
      bankAccountDetails
      taxNumber
      accountsReceivableTaxType
      accountsPayableTaxType
      addresses {
        addressType
        addressLine1
        addressLine2
        addressLine3
        addressLine4
        city
        region
        postalCode
        country
        attentionTo
      }
      phones {
        phoneType
        phoneNumber
        phoneAreaCode
        phoneCountryCode
      }
      isSupplier
      isCustomer
      defaultCurrency
      updatedDateUTC
      contactPersons {
        firstName
        lastName
        emailAddress
        includeInEmails
      }
      hasAttachments
      xeroNetworkKey
      salesDefaultAccountCode
      purchasesDefaultAccountCode
      trackingCategoryName
      trackingCategoryOption
      paymentTerms
      website
      discount
    }
  }
`;
export const xeroListTransactions = /* GraphQL */ `
  query XeroListTransactions($statuses: [XeroInvoiceStatus], $page: Int) {
    xeroListTransactions(statuses: $statuses, page: $page) {
      invoiceID
      type
      status
      lineAmountTypes
      currencyCode
      date
      dueDate
      lineItems {
        lineItemID
        description
        quantity
        unitAmount
        itemCode
        accountCode
        accountID
        taxType
        taxAmount
        lineAmount
        taxNumber
        discountRate
        discountAmount
        repeatingInvoiceID
      }
      subTotal
      totalTax
      total
      invoiceNumber
      reference
      hasAttachments
      updatedDateUTC
      currencyRate
      remainingCredit
      amountDue
      amountPaid
      fullyPaidOnDate
      amountCredited
      brandingThemeID
      hasErrors
      contact {
        contactID
        contactNumber
        accountNumber
        contactStatus
        name
        firstName
        lastName
        companyNumber
        emailAddress
        bankAccountDetails
        taxNumber
        accountsReceivableTaxType
        accountsPayableTaxType
        isSupplier
        isCustomer
        defaultCurrency
        updatedDateUTC
        hasAttachments
        xeroNetworkKey
        salesDefaultAccountCode
        purchasesDefaultAccountCode
        trackingCategoryName
        trackingCategoryOption
        paymentTerms
        website
        discount
      }
    }
  }
`;
