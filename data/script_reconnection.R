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
dt_rcn <-read.csv('/home/arthur/TCC/code/data/data_reconnection.csv')

#Separando os dados por altura
dt_rcn.h2 <- dt_rcn$delay[dt_rcn$height == 2]
dt_rcn.h3 <- dt_rcn$delay[dt_rcn$height == 3]
dt_rcn.h4 <- dt_rcn$delay[dt_rcn$height == 4]

#médias de por altura
dt_rcn.h2.mean <- mean(dt_rcn.h2)
dt_rcn.h3.mean <- mean(dt_rcn.h3)
dt_rcn.h4.mean <- mean(dt_rcn.h4)
#limites inferior e superior do intervalo de confiança
ci <- ci95(dt_rcn.h2)
dt_rcn.h2.li <- ci[1][1]
dt_rcn.h2.ls <- ci[2][1]
ci <- ci95(dt_rcn.h3)
dt_rcn.h3.li <- ci[1][1]
dt_rcn.h3.ls <- ci[2][1]
ci <- ci95(dt_rcn.h4)
dt_rcn.h4.li <- ci[1][1]
dt_rcn.h4.ls <- ci[2][1]

summary(dt_rcn$delay)
sd(dt_rcn$delay)
#Intervalo de confiança de 95% para média
dt_rcn.ic95 <- ci95(dt_rcn$delay)

#histograma
hist(dt_rcn$delay, ylab="Frequência", xlab = "Tempo de retomada de reprodução (s)", main="")

#boxplot por altura
boxplot(dt_rcn.h2, dt_rcn.h3, dt_rcn.h4, xlab="Altura do peer", names=2:4, ylab="Tempo de retomada de reprodução (s)")

#plot dos intervalos de confiança a 95% dos tempo para cada altura
plotCI(2:4, 
       c(dt_rcn.h2.mean, dt_rcn.h3.mean, dt_rcn.h4.mean),
       ui=c(dt_rcn.h2.ls, dt_rcn.h3.ls, dt_rcn.h4.ls),
       li=c(dt_rcn.h2.li, dt_rcn.h3.li, dt_rcn.h4.li), ylab = "Tempo médio de retomada de reprodução (s)", xlab="Altura dos peers", names=2:4)




