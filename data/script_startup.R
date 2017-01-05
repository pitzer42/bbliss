require(plotrix)

ci95 <- function(data){
	n = length(data)
	s = sd(data)
	SE = s/sqrt(n)
	E = qt(.975, df=n-1)*SE
	xbar = mean(data)
	return(xbar + c(-E, E))
}


#Dados do teste de tempo de início da reprodução
dt_stp <-read.csv('/home/arthur/TCC/docs/data_startup.csv')
#remover outliers
dt_stp <- dt_stp[!(dt_stp$time %in% boxplot.stats(dt_stp$time)$out), ]

#Separando os dados por altura
dt_stp.h1 <- dt_stp$time[dt_stp$height == 1]
dt_stp.h2 <- dt_stp$time[dt_stp$height == 2]
dt_stp.h3 <- dt_stp$time[dt_stp$height == 3]
dt_stp.h4 <- dt_stp$time[dt_stp$height == 4]

#médias de por altura
dt_stp.h1.mean <- mean(dt_stp.h1)
dt_stp.h2.mean <- mean(dt_stp.h2)
dt_stp.h3.mean <- mean(dt_stp.h3)
dt_stp.h4.mean <- mean(dt_stp.h4)
#limites inferior e superior do intervalo de confiança
ci <- ci95(dt_stp.h1)
dt_stp.h1.li <- ci[1][1]
dt_stp.h1.ls <- ci[2][1]
ci <- ci95(dt_stp.h2)
dt_stp.h2.li <- ci[1][1]
dt_stp.h2.ls <- ci[2][1]
ci <- ci95(dt_stp.h3)
dt_stp.h3.li <- ci[1][1]
dt_stp.h3.ls <- ci[2][1]
ci <- ci95(dt_stp.h4)
dt_stp.h4.li <- ci[1][1]
dt_stp.h4.ls <- ci[2][1]

summary(dt_stp$time)
sd(dt_stp$time)
#Intervalo de confiança de 95% para média
dt_stp.ic95 <- ci95(dt_stp$time)

#histograma
hist(dt_stp$time, ylab="Frequência", xlab = "Tempo de início de reprodução (ms)", main="")

#boxplot por altura
boxplot(dt_stp.h1, dt_stp.h2, dt_stp.h3, dt_stp.h4, xlab="Altura do peer", names=c(1,2,3,4), ylab="Tempo de início da reprodução (ms)")

#plot dos intervalos de confiança a 95% dos tempo para cada altura
plotCI(c(1,2,3,4), 
       c(dt_stp.h1.mean, dt_stp.h2.mean, dt_stp.h3.mean, dt_stp.h4.mean),
       ui=c(dt_stp.h1.ls, dt_stp.h2.ls, dt_stp.h3.ls, dt_stp.h4.ls),
       li=c(dt_stp.h1.li, dt_stp.h2.li, dt_stp.h3.li, dt_stp.h4.li), ylab = "Tempo médio de início da reprodução (ms)", xlab="Altura dos peers", names=1:4)




