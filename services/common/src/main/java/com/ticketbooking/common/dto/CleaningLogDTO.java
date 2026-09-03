package com.ticketbooking.common.dto;
import java.time.LocalDateTime;
public class CleaningLogDTO {
    private Long tableId;
    private String tableNumber;
    private String previousStatus;
    private String newStatus;
    private String staffEmail;
    private String note;
    private LocalDateTime timestamp;
    public CleaningLogDTO() {}
    public Long getTableId() { return tableId; }
    public void setTableId(Long id) { this.tableId = id; }
    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String n) { this.tableNumber = n; }
    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String s) { this.previousStatus = s; }
    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String s) { this.newStatus = s; }
    public String getStaffEmail() { return staffEmail; }
    public void setStaffEmail(String e) { this.staffEmail = e; }
    public String getNote() { return note; }
    public void setNote(String n) { this.note = n; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime t) { this.timestamp = t; }
}
