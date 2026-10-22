package com.breadwinners.controller;

import com.breadwinners.dto.accountview.AccountInformationRequestDto;
import com.breadwinners.dto.accountview.AccountInformationResponseDto;
import com.breadwinners.dto.accountview.UpdateNicknameRequestDto;
import com.breadwinners.dto.accountview.UpdateNicknameResponseDto;
import com.breadwinners.service.AccountDetailsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountDetailsControllerTest {

    @Mock
    private AccountDetailsService accountDetailsService;

    @InjectMocks
    private AccountDetailsController accountDetailsController;

    @Test
    void testFetchAccountInformation_Returns200AndBody() {
        AccountInformationRequestDto request = new AccountInformationRequestDto(123456789012L);
        AccountInformationResponseDto mockResponse = mock(AccountInformationResponseDto.class);

        when(accountDetailsService.fetchAccountDetails(request)).thenReturn(mockResponse);

        ResponseEntity<AccountInformationResponseDto> responseEntity =
                accountDetailsController.fetchAccountInformation(request);

        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(mockResponse, responseEntity.getBody());
    }

    @Test
    void testModifyNickname_Returns200AndBody() {
        UpdateNicknameRequestDto request = new UpdateNicknameRequestDto(123456789012L, "Savings");
        UpdateNicknameResponseDto mockResponse = mock(UpdateNicknameResponseDto.class);

        when(accountDetailsService.updateNickname(request)).thenReturn(mockResponse);

        ResponseEntity<UpdateNicknameResponseDto> responseEntity =
                accountDetailsController.modifyNickname(request);

        assertNotNull(responseEntity);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(mockResponse, responseEntity.getBody());
    }
}
