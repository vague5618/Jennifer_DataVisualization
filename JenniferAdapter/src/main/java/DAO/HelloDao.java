package DAO;

import DTO.Hello;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;


public class HelloDao{
    private DataSource dataSource;
    private JdbcTemplate jdbcTemplateObject;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
        this.jdbcTemplateObject = new JdbcTemplate(dataSource);
    }

    public int insert(Hello hello) {
        String query = "INSERT INTO hello(name, message) VALUES(?, ?)";
        return jdbcTemplateObject.update(query, hello.getName(), hello.getMessage());
    }
}