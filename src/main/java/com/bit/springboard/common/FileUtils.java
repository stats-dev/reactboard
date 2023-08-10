package com.bit.springboard.common;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.bit.springboard.configuration.NaverConfiguration;
import com.bit.springboard.entity.BoardFile;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@Component //자동으로 객체 생성되도록 만든다.
public class FileUtils {
	private final AmazonS3 s3;

	//생성자 생성
	public FileUtils(NaverConfiguration naverConfiguration) {
		s3 = AmazonS3ClientBuilder.standard()
				.withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(
						naverConfiguration.getEndPoint(), naverConfiguration.getRegionName()
				))
				.withCredentials(new AWSStaticCredentialsProvider(
						new BasicAWSCredentials(
								naverConfiguration.getAccessKey(), naverConfiguration.getSecretKey()
						)
				))
				.build();
	}


	//MultipartFile 객체를 받아서 DTO형태로 변경 후 리턴
	//static아니라 일반 메소드로 만든다. 로컬 저장 안하므로 attachPath도 제거한다.
	public BoardFile parseFileInfo(MultipartFile file, String directoryPath) throws IOException {

		String bucketName = "bitcamp-bucket-144";
//		String directoryName = "board/"; //게시판만 할거면 요렇게만 둔다. 아니면 위의 매개변수를 사용할 수도 있다. 하나만 할거면 위의 매개변수는 필요 없다.

		//리턴할 BoardDTO 객체 생성
		BoardFile boardFile = new BoardFile();
		
		String boardFileOrigin = file.getOriginalFilename();

		//같은 파일명 파일이 올라오면 나중에 업로드 된 파일로 덮어써지기 때문에 
		//파일명을 날짜_랜덤_...
		SimpleDateFormat formmater = 
				new SimpleDateFormat("yyyyMMddHHmmss");
		Date nowDate = new Date();
		String nowDateStr = formmater.format(nowDate);
		
		UUID uuid = UUID.randomUUID();
		
		//실제 db에 저장될 파일명
		String boardFileName = nowDateStr + "_" + uuid.toString() 
					+ "_" + boardFileOrigin;

//		String boardFilePath = attachPath;
		String boardFilePath = directoryPath;


		//이미지인지 아닌지 검사
		File checkFile = new File(boardFileOrigin);
		//파일의 형식 가져오기
		String type = Files.probeContentType(checkFile.toPath());
		
		if(type != null) {
			if(type.startsWith("image")) {
				boardFile.setBoardFileCate("image");
			} else {
				boardFile.setBoardFileCate("etc");
			}
		} else {
			boardFile.setBoardFileCate("etc");
		}
		
		//파일 업로드 처리
//		File uploadFile = new File(attachPath + boardFileName);

		//리턴될 DTO 셋팅
		boardFile.setBoardFileName(boardFileName);
		boardFile.setBoardFileOrigin(boardFileOrigin);
		boardFile.setBoardFilePath(boardFilePath);

		//try 구분안에서만 사용할 객체나 변수를 선언할 수 있다.
		//주로 사용할
		try(InputStream fileInputStream = file.getInputStream()) {
			ObjectMetadata objectMetadata = new ObjectMetadata();
			objectMetadata.setContentType(file.getContentType());

			PutObjectRequest putObjectRequest = new PutObjectRequest(
					bucketName,
					directoryPath + boardFileName,
					fileInputStream,
					objectMetadata
			).withCannedAcl(CannedAccessControlList.PublicRead); //전체 읽는 권한 주기

			s3.putObject(putObjectRequest); //s3에 저장해준다.
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return boardFile;
	}
}
