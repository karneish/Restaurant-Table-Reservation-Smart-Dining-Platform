package com.ticketbooking.common.dto;
public class StripePaymentRequest {
    private String amount;
    private String currency;
    private String paymentMethodId;
    private String description;
    public StripePaymentRequest() {}
    public String getAmount() { return amount; }
    public void setAmount(String a) { this.amount = a; }
    public String getCurrency() { return currency; }
    public void setCurrency(String c) { this.currency = c; }
    public String getPaymentMethodId() { return paymentMethodId; }
    public void setPaymentMethodId(String p) { this.paymentMethodId = p; }
    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }
}
