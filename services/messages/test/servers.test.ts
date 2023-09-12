import { ServerRepositoryImpl } from '@repositories/server/server-repository-impl'
import { ServerRepository } from '@repositories/server/server-repository'
import { Microservice } from '@commons/service'
import { MessagesServiceConfiguration } from '@/configuration'

const messagesMicroservice: Microservice = new Microservice(MessagesServiceConfiguration)
const serverRepository: ServerRepository = new ServerRepositoryImpl()

beforeAll(async () => {
  await messagesMicroservice.start()
})

afterAll(async () => {
  await messagesMicroservice.stop()
})

afterEach(async () => {
  await messagesMicroservice.clearDatabase()
})

//server tests
describe('CREATE operation', () => {
  it('basic create', async () => {
    await serverRepository.addServer('serverId', 'participantId')
    const servers = await serverRepository.getServerParticipants('serverId')
    expect(servers.length).toBe(1)
    expect(servers[0]).toBe('participantId')
  })
})

describe('GET operation', () => {
  it("it should return an error if server doesn't exists", async () => {
    await expect(serverRepository.getServerParticipants('serverId')).rejects.toThrow(
      new Error('Server not found')
    )
  })
  it('should return a server if it exists', async () => {
    await serverRepository.addServer('serverId', 'participantId')
    const servers = await serverRepository.getServerParticipants('serverId')
    expect(servers.length).toBe(1)
    expect(servers[0]).toBe('participantId')
  })
})

describe('Participant operations', () => {
  it('should add a participant to a server', async () => {
    await serverRepository.addServer('serverId', 'participantId')
    await serverRepository.addParticipant('serverId', 'participantId2')
    const servers = await serverRepository.getServerParticipants('serverId')
    expect(servers.length).toBe(2)
    expect(servers[0]).toBe('participantId')
    expect(servers[1]).toBe('participantId2')
  })
  it('should remove a participant from a server', async () => {
    await serverRepository.addServer('serverId', 'participantId')
    await serverRepository.addParticipant('serverId', 'participantId2')
    await serverRepository.removeParticipant('serverId', 'participantId2')
    const servers = await serverRepository.getServerParticipants('serverId')
    expect(servers.length).toBe(1)
    expect(servers[0]).toBe('participantId')
  })
  it("should return an error if server doesn't exists in remove operation", async () => {
    await serverRepository.addServer('serverId', 'participantId')
    await expect(
      serverRepository.removeParticipant('serverId2', 'participantId')
    ).rejects.toThrow(Error)
  })
})
