package com.breadwinners.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);
    private static final int SERVICE_NAME = 0;
    private static final int METHOD_NAME = 1;

    //Define a central pointcut for service package
    @Pointcut("execution(* com.breadwinners.service.*.*(..))")
    public void serviceLayer() {}

    // Logging service layer calls before method execution
    @Before("serviceLayer()")
    public void logBeginningOfService(JoinPoint jp) {
        String[] callInfo = getServiceAndMethodName(jp);
        logger.info("--> {}.{}() started", callInfo[SERVICE_NAME], callInfo[METHOD_NAME]);
    }

    // Logging successfully method return with results
    @AfterReturning(pointcut = "serviceLayer()", returning = "result")
    public void logSuccessfulServiceMethods(JoinPoint jp, Object result) {
        String[] successInfo = getServiceAndMethodName(jp);
        logger.info("<-- {}.{}() completed successfully", successInfo[SERVICE_NAME], successInfo[METHOD_NAME]);
    }

    // Logging failed method calls with specific exception thrown
    @AfterThrowing(pointcut = "serviceLayer()", throwing = "exc")
    public void logServiceExceptions(JoinPoint jp, Throwable exc) {
        String[] excInfo = getServiceAndMethodName(jp);
        logger.error("<-- {}.{}() failed with exception", excInfo[SERVICE_NAME], excInfo[METHOD_NAME], exc);
    }


    //Given a joinpoint extracts the full service name and method name
    private static String [] getServiceAndMethodName(JoinPoint jp){
        return new String[] {
                //Full class name of service
                jp.getSignature().getDeclaringType().getSimpleName(),
                //Method name that was called.
            jp.getSignature().getName()};
    }
}
