package com.ticketbooking.common.dto;
public class RestaurantRatingUpdate {
    private Long restaurantId;
    private double averageRating;
    private int totalReviews;
    public RestaurantRatingUpdate() {}
    public RestaurantRatingUpdate(Long id, double avg, int total) { this.restaurantId = id; this.averageRating = avg; this.totalReviews = total; }
    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long id) { this.restaurantId = id; }
    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double r) { this.averageRating = r; }
    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int t) { this.totalReviews = t; }
}
