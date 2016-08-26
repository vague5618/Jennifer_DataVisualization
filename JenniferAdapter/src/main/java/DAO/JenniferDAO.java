package DAO;

import DTO.Hello;
import com.jennifersoft.view.adapter.JenniferModel;
import com.jennifersoft.view.adapter.model.JenniferTransaction;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

/**
 * Created by JAY on 2016. 8. 26..
 */
public class JenniferDAO {

    private DataSource dataSource;
    private JdbcTemplate jdbcTemplateObject;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
        this.jdbcTemplateObject = new JdbcTemplate(dataSource);
    }

    public int insert(JenniferTransaction model) {
        String query = "INSERT INTO xView(DomainId, ResponseTime, EndTime) VALUES(?, ?, ?)";
        return jdbcTemplateObject.update(query, model.getDomainId(), model.getResponseTime(), model.getEndTime());
    }
}
