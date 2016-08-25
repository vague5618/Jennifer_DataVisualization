package test;

import DAO.HelloDao;
import DTO.Hello;
import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by JAY on 2016. 8. 25..
 */

@SpringBootApplication
public class app {

    public static HelloDao dao;
    private static final Logger log = Logger.getLogger(app.class);

    public static void main(String[] args) {

        ApplicationContext context =
                new ClassPathXmlApplicationContext("Beans.xml");

        SpringApplication.run(app.class, args);

        dao = new HelloDao();

        Hello hello = new Hello();
        hello.setName("Jay");
        hello.setMessage("Good");

        log.info(hello.getName());
        log.info(hello.getMessage());

        HelloDao dao =
                (HelloDao)context.getBean("HelloDao");


       log.info(dao.insert(hello));
    }
}
