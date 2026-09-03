ackage com.ticketbooking.common.dto;
import java.util.List;
public class PaginationResponse<T> {
    private List<T> content; private int page; private int size;
    private long totalElements; private int totalPages;
    public PaginationResponse() {}
    public PaginationResponse(List<T> c, int p, int s, long te, int tp) {
        this.content = c; this.page = p; this.size = s; this.totalElements = te; this.totalPages = tp;
    }
    public List<T> getContent() { return content; }
    public void setContent(List<T> c) { this.content = c; }
    public int getPage() { return page; }
    public void setPage(int p) { this.page = p; }
    public int getSize() { return size; }
    public void setSize(int s) { this.size = s; }
    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long te) { this.totalElements = te; }
    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int tp) { this.totalPages = tp; }
}
