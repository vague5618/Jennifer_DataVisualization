package main;

import com.jennifersoft.view.LogUtil;
import com.jennifersoft.view.adapter.JenniferAdapter;
import com.jennifersoft.view.adapter.JenniferModel;
import com.jennifersoft.view.adapter.model.JenniferTransaction;


import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * Created by JAY on 2016. 8. 26..
 */
public class XViewHandler implements JenniferAdapter {

    public void on(JenniferModel[] message) {

        Connection conn = null;
        PreparedStatement preparedStatement = null;
        try {

            Context ctx = new InitialContext();
            DataSource ds = (DataSource) ctx.lookup("java:comp/env/jdbc/jenniferTest");
            conn = ds.getConnection();

            String insertTableSQL = "INSERT INTO xView"
                    + "(DomainId, EndTime, ResponseTime)"
                    + " VALUES (?,?,?)";

            preparedStatement = conn.prepareStatement(insertTableSQL);

            for (int i = 0; i < message.length; i++) {

                JenniferTransaction model = (JenniferTransaction) message[i];

                LogUtil.error("End time : " + model.getEndTime());
                LogUtil.error("Domain ID : " + model.getDomainId());
                LogUtil.error("ResponseTime : " + model.getResponseTime());

                preparedStatement.setLong(1, model.getDomainId());
                preparedStatement.setLong(2, model.getEndTime());
                preparedStatement.setLong(3, model.getResponseTime());

                preparedStatement.addBatch();
            }

            preparedStatement.executeBatch();

        } catch (NamingException e) {
            LogUtil.error(e);
            e.printStackTrace();
        } catch (SQLException e) {
            LogUtil.error(e);
            e.printStackTrace();
        } finally {
            try {
                if (preparedStatement != null) {
                    preparedStatement.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
