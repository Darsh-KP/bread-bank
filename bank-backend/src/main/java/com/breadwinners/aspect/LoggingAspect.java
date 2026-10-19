package com.breadwinners.aspect;

import com.breadwinners.dto.auth.LoginRequestDto;
import com.breadwinners.dto.auth.LoginResponse;
import com.breadwinners.dto.auth.UserResponse;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    //Define a central pointcut for service package
    @Pointcut("execution(* com.breadwinners.service.*.*(..))")
    public void serviceLayer() {}

    //Logging service layer calls before method execution
    @Before("serviceLayer()")
    public void logBeginningOfService(JoinPoint jp) {
        Object [] cleanedArgs = returnCleanedPII(jp.getArgs());
        logger.info("Calling method: {} with arguments: {}", jp.getSignature().getName(), cleanedArgs);
    }

    //Logging successfully method return with results.
    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logSuccessfulServiceMethods(JoinPoint jp, Object result) {
        Object cleanedResult = returnCleanedPII(result);
        logger.info("{} successfully returned: {}", jp.getSignature().getName(), cleanedResult);
    }

    //Logging failed method calls with specific exception thrown.
    @AfterThrowing(pointcut="serviceLayer()", throwing="exc")
    public void logServiceExceptions(JoinPoint jp, Throwable exc){
        logger.error(jp.getSignature().getName() + " threw: ", exc);
    }

    private Object [] returnCleanedPII(Object [] args){
        Object [] cleanedArgs = new Object[args.length];
        for (int i = 0; i < args.length; i++){
            cleanedArgs[i] = returnCleanedPII(args[i]);
        }
        return cleanedArgs;
    }

    private Object returnCleanedPII(Object requestResponse){
        if(requestResponse instanceof LoginResponse){
            return cleanPII((LoginResponse) requestResponse);
        } else if (requestResponse instanceof LoginRequestDto) {
            return cleanPII((LoginRequestDto) requestResponse);
        }
        return requestResponse;
    }

    private String cleanPII(LoginRequestDto request) {
        return request.username();
    }

    private UserResponse cleanPII(LoginResponse response){
        return response.userResponse();
    }

}
