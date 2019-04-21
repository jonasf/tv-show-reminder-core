FROM mcr.microsoft.com/dotnet/core/aspnet:2.2 AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR /src
RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs
COPY ["src/tv-show-reminder-spa/tv-show-reminder-spa.csproj", "src/tv-show-reminder-spa/"]
COPY ["src/TvShowReminder.Service/TvShowReminder.Service.csproj", "src/TvShowReminder.Service/"]
COPY ["src/TvShowReminder.TvMazeApi/TvShowReminder.TvMazeApi.csproj", "src/TvShowReminder.TvMazeApi/"]
COPY ["src/TvShowReminder.Contracts/TvShowReminder.Contracts.csproj", "src/TvShowReminder.Contracts/"]
COPY ["src/TvShowReminder.DataSource/TvShowReminder.DataSource.csproj", "src/TvShowReminder.DataSource/"]
COPY ["src/TvShowReminder.DatabaseMigrations/TvShowReminder.DatabaseMigrations.csproj", "src/TvShowReminder.DatabaseMigrations/"]
RUN dotnet restore "src/tv-show-reminder-spa/tv-show-reminder-spa.csproj"
COPY . .
WORKDIR "/src/src/tv-show-reminder-spa"
RUN dotnet build "tv-show-reminder-spa.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "tv-show-reminder-spa.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "tv-show-reminder-spa.dll"]