package com.breadwinners.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {

    private static Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    //Define a central pointcut for service package
    @Pointcut("execution(* com.breadwinners.service.*.*(..))")
    public void serviceLayer() {}

    //Logging service layer calls before method execution
    @Before("serviceLayer()")
    public void logBeginningOfService(JoinPoint jp) {
        logger.info("Calling method: {} with arguments: {}", jp.getSignature().getName(), jp.getArgs());
    }

    //Logging successfully method return with results.
    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logSuccessfulServiceMethods(JoinPoint jp, Object result) {
        logger.info("{} successfully returned: {}", jp.getSignature().getName(), result);
    }

    //Logging failed method calls with specific exception thrown.
    @AfterThrowing(pointcut="execution(* com.revature.services.*.*(..))", throwing="exc")
    public void logServiceExceptions(JoinPoint jp, Throwable exc){
        logger.error(jp.getSignature().getName() + " threw: " + exc);
    }

}
