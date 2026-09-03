package com.ticketbooking.common.dto;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success; private String message; private T data; private String timestamp;
    public ApiResponse() { this.timestamp = LocalDateTime.now().toString(); }
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> r = new ApiResponse<>(); r.setSuccess(true); r.setMessage("OK"); r.setData(data); return r;
    }
    public static <T> ApiResponse<T> success(String msg, T data) {
        ApiResponse<T> r = new ApiResponse<>(); r.setSuccess(true); r.setMessage(msg); r.setData(data); return r;
    }
    public static <T> ApiResponse<T> error(String msg) {
        ApiResponse<T> r = new ApiResponse<>(); r.setSuccess(false); r.setMessage(msg); return r;
    }
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean s) { this.success = s; }
    public String getMessage() { return message; }
    public void setMessage(String m) { this.message = m; }
    public T getData() { return data; }
    public void setData(T d) { this.data = d; }
    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String t) { this.timestamp = t; }
}
