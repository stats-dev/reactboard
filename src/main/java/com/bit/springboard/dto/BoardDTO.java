package com.bit.springboard.dto;

import com.bit.springboard.entity.Board;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDTO {
    private int boardNo;
    private String boardTitle;
    private String boardContent;
    private String boardWriter;
    private String boardRegdate;
    private int boardCnt;


    public Board DTOToEntity() {
        return Board.builder()
                .boardNo(this.boardNo)
                .boardTitle(this.boardTitle)
                .boardContent(this.boardContent)
                .boardWriter(this.boardWriter)
                .boardRegdate(LocalDateTime.parse(this.boardRegdate))
                .boardCnt(this.boardCnt)
                .build();
    }


}
