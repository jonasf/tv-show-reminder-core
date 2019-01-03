FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["src/tv-show-reminder-core/tv-show-reminder-core.csproj", "src/tv-show-reminder-core/"]
COPY ["src/TvShowReminder.Service/TvShowReminder.Service.csproj", "src/TvShowReminder.Service/"]
COPY ["src/TvShowReminder.TvMazeApi/TvShowReminder.TvMazeApi.csproj", "src/TvShowReminder.TvMazeApi/"]
COPY ["src/TvShowReminder.Contracts/TvShowReminder.Contracts.csproj", "src/TvShowReminder.Contracts/"]
COPY ["src/TvShowReminder.DataSource/TvShowReminder.DataSource.csproj", "src/TvShowReminder.DataSource/"]
COPY ["src/TvShowReminder.DatabaseMigrations/TvShowReminder.DatabaseMigrations.csproj", "src/TvShowReminder.DatabaseMigrations/"]
RUN dotnet restore "src/tv-show-reminder-core/tv-show-reminder-core.csproj"
COPY . .
WORKDIR "/src/src/tv-show-reminder-core"
RUN dotnet build "tv-show-reminder-core.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "tv-show-reminder-core.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "tv-show-reminder-core.dll"]