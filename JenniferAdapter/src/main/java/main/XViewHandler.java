package main;

import com.jennifersoft.view.LogUtil;
import com.jennifersoft.view.adapter.JenniferAdapter;
import com.jennifersoft.view.adapter.JenniferModel;
import com.jennifersoft.view.adapter.model.JenniferTransaction;

/**
 * Created by JAY on 2016. 8. 26..
 */
public class XViewHandler implements JenniferAdapter {
    public void on(JenniferModel[] message) {
        for(int i = 0; i < message.length; i++) {
            JenniferTransaction model = (JenniferTransaction) message[i];

            // 트랜잭션 모델을 참조하여 핸들러 구현하기
            System.out.println("도메인 아이디: " + model.getDomainId());
            System.out.println("인스턴스 이름: " + model.getInstanceName());
            System.out.println("트랜잭션 아이디: " + model.getTxid());
            System.out.println("응답시간: " + model.getResponseTime());
            System.out.println("애플리케이션: " + model.getApplicationName());

            LogUtil.error("Domain ID : " + model.getDomainId());


        }
    }
}
