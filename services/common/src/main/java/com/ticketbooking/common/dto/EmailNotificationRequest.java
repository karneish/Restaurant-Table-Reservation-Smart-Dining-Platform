ackage com.ticketbooking.common.dto;
public class EmailNotificationRequest {
    private String to;
    private String subject;
    private String body;
    private boolean html;
    public EmailNotificationRequest() {}
    public EmailNotificationRequest(String to, String subject, String body) {
        this.to = to; this.subject = subject; this.body = body;
    }
    public String getTo() { return to; }
    public void setTo(String t) { this.to = t; }
    public String getSubject() { return subject; }
    public void setSubject(String s) { this.subject = s; }
    public String getBody() { return body; }
    public void setBody(String b) { this.body = b; }
    public boolean isHtml() { return html; }
    public void setHtml(boolean h) { this.html = h; }
}
